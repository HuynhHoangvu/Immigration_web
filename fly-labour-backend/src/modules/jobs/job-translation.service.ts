import { Injectable, Logger } from '@nestjs/common'

type TranslateField = 'title' | 'description' | 'requirements' | 'benefits'

@Injectable()
export class JobTranslationService {
  private readonly logger = new Logger(JobTranslationService.name)
  private readonly endpoint = process.env.TRANSLATE_API_URL || 'https://libretranslate.de/translate'
  private readonly apiKey = process.env.TRANSLATE_API_KEY
  private readonly timeoutMs = Number(process.env.TRANSLATE_TIMEOUT_MS || 6000)
  private readonly retries = Number(process.env.TRANSLATE_RETRIES || 2)
  private readonly enabled = (process.env.TRANSLATE_ENABLED || 'true').toLowerCase() !== 'false'

  async enrichEnglishFields<T extends Record<string, any>>(
    payload: T,
    existing?: Record<string, any>,
    forceRetranslate: boolean = false,
  ): Promise<T> {
    if (!this.enabled) return payload

    const result: Record<string, any> = { ...payload }
    const fields: TranslateField[] = ['title', 'description', 'requirements', 'benefits']

    for (const field of fields) {
      const source = payload[field]
      const targetKey = `${field}En`
      if (!source || typeof source !== 'string' || source.trim().length === 0) continue
      if (payload[targetKey] && String(payload[targetKey]).trim().length > 0) continue

      if (forceRetranslate) {
        result[targetKey] = await this.translateWithFallback(source, field)
        continue
      }

      const previousSource = existing?.[field]
      const previousTarget = existing?.[targetKey]
      const sourceChanged = typeof previousSource !== 'string' || previousSource.trim() !== source.trim()

      // Update flow: if Vietnamese source changed, refresh English auto-translation.
      if (existing && !sourceChanged && previousTarget && String(previousTarget).trim().length > 0) {
        continue
      }

      result[targetKey] = await this.translateWithFallback(source, field)
    }

    return result as T
  }

  private async translateWithFallback(text: string, field: TranslateField): Promise<string> {
    try {
      return await this.translateViToEn(text)
    } catch (error: any) {
      this.logger.warn(`Translate failed for ${field}, fallback to original text: ${error?.message || 'unknown error'}`)
      return text
    }
  }

  private async translateViToEn(text: string): Promise<string> {
    let lastError: any
    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs)

        const res = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            source: 'vi',
            target: 'en',
            format: 'text',
            api_key: this.apiKey,
          }),
          signal: controller.signal,
        })
        clearTimeout(timeout)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json() as { translatedText?: string }
        if (!data?.translatedText) throw new Error('Missing translatedText')
        return data.translatedText
      } catch (error: any) {
        lastError = error
        if (attempt < this.retries) await this.sleep(250 * (attempt + 1))
      }
    }
    throw lastError || new Error('Translate failed')
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
