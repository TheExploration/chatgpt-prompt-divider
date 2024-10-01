import { useState } from 'react'
import type { NextPage } from 'next'
import styles from './index.module.scss'

const Home: NextPage = () => {
  const [input, setInput] = useState('')

  const chunks = getChunks(input, 1500)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className={styles.base}>
      <div className={styles.container}>
        {/* Heading and description */}
        <h1 className={styles.heading}>ChatGPT Prompt Divider</h1>
        <p className={styles.introParagraph}>
          ChatGPT prompts are limited to 1500 characters. This tool will divide
          your prompts into as many chunks are needed to stay under the
          character limit. It will also modify the prompts so that ChatGPT will
          wait for further input before responding to the split-up prompt.
        </p>

        {/* Input */}
        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter your prompt here...'
        />
        {/* Output */}
        <div className={styles.chunkList}>
          {chunks.map((chunk, index) => (
            <div className={styles.chunk} key={chunk.slice(0, 20)}>
              <div className={styles.chunkText}>{chunk}</div>
              <button
                className={styles.copyButton}
                onClick={() => handleCopy(chunk)}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Splits a given text string into smaller chunks of a defined maximum size
 * without cutting words in the middle. The first chunk will include
 * instructions for ChatGPT, and the last chunk will have a finished string
 * appended. If the input text is shorter than the defined chunk size, it will
 * be returned as the only chunk.
 *
 * @param {string} str - The input text string to be split into chunks.
 * @param {number} chunkSize - The maximum number of characters allowed in each chunk.
 * @returns {string[]} An array of chunks, where each chunk has a length less than or equal to the specified chunk size.
 * @throws Will throw an error if the chunk size is too small to accommodate the instructions for ChatGPT.
 */
function getChunks(str: string, chunkSize: number): string[] {
  // If the string is already less than or equal to the chunk size, then
  // just return the string as the only chunk.
  if (str.length <= chunkSize) {
    return [str]
  }

  const instructions =
    ''

  const finishedString = '\n\n(FINISHED)'

  if (chunkSize < instructions.length) {
    throw new Error(
      `The chunk size must be at least ${instructions.length} characters long to accommodate the instructions.`
    )
  }

  const chunks = []

  // The first chunk will be the first chunkSize characters of the input string
  // minus the length of the instructions string.
  const firstChunkSize = chunkSize - instructions.length
  let endIndex = str.lastIndexOf(' ', firstChunkSize)
  endIndex = endIndex === -1 ? firstChunkSize : endIndex
  chunks.push(str.slice(0, endIndex) + instructions)

  // The remaining chunks will be split up into chunks of chunkSize characters
  // starting where the previous chunk left off.
  let startIndex = endIndex
  while (startIndex < str.length) {
    endIndex = str.lastIndexOf(' ', startIndex + chunkSize)
    endIndex =
      endIndex === -1 || endIndex <= startIndex
        ? startIndex + chunkSize
        : endIndex

    const chunk = str.slice(startIndex, endIndex)
    chunks.push(chunk)

    startIndex = endIndex
  }

  if (chunks[chunks.length - 1].length + finishedString.length <= chunkSize) {
    chunks[chunks.length - 1] += finishedString
  } else {
    chunks.push(finishedString)
  }

  // Trim leading and trailing whitespace from each chunk.
  for (let i = 0; i < chunks.length; i++) {
    chunks[i] = chunks[i].trim()
  }

  return chunks
}

export default Home
