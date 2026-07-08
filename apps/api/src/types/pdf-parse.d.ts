declare module 'pdf-parse' {
  export default function pdfParse(buffer: Buffer, options?: Record<string, unknown>): Promise<{ text: string }>
}
