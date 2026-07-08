import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}

  async putObject(path: string, buffer: Buffer) {
    const uploadDir = this.config.get('UPLOAD_DIR') ?? './uploads'
    const absolutePath = join(uploadDir, path)
    await mkdir(dirname(absolutePath), { recursive: true })
    await writeFile(absolutePath, buffer)
    return `/uploads/${path.replaceAll('\\', '/')}`
  }
}
