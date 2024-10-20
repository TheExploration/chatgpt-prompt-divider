import { useState } from 'react';
import type { NextPage } from 'next';
import styles from './index.module.scss';

const Home: NextPage = () => {
  const [input, setInput] = useState('');
  const [clickedButtons, setClickedButtons] = useState<boolean[]>([]);

  const chunks = getChunks(input, 3000);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);

      // Mark the button at the corresponding index as clicked
      setClickedButtons((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={styles.base}>
      <div className={styles.container}>
        <h1 className={styles.heading}>ChatGPT Prompt Divider</h1>
        <p className={styles.introParagraph}>
          ChatGPT prompts are limited to 3000 characters. This tool will divide
          your prompts into as many chunks as needed to stay under the character limit. It will also modify the prompts so that ChatGPT will wait for further input before responding to the split-up prompt.
        </p>

        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt here..."
        />

        <div className={styles.chunkList}>
          {chunks.map((chunk, index) => (
            <div className={styles.chunk} key={chunk.slice(0, 20)}>
              <div className={styles.chunkText}>{chunk}</div>
              <button
                className={`${styles.copyButton} ${
                  clickedButtons[index] ? styles.clicked : ''
                }`}
                onClick={() => handleCopy(chunk, index)}
              >
                {clickedButtons[index] ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Function to get chunks (remains unchanged)
 */
function getChunks(str: string, chunkSize: number): string[] {
  if (str.length <= chunkSize) return [str];

  const instructions = '';
  const finishedString = '\n\n(FINISHED)';
  
  if (chunkSize < instructions.length) {
    throw new Error(
      `The chunk size must be at least ${instructions.length} characters long to accommodate the instructions.`
    );
  }

  const chunks = [];
  const firstChunkSize = chunkSize - instructions.length;
  let endIndex = str.lastIndexOf(' ', firstChunkSize);
  endIndex = endIndex === -1 ? firstChunkSize : endIndex;
  chunks.push(str.slice(0, endIndex) + instructions);

  let startIndex = endIndex;
  while (startIndex < str.length) {
    endIndex = str.lastIndexOf(' ', startIndex + chunkSize);
    endIndex = endIndex === -1 || endIndex <= startIndex ? startIndex + chunkSize : endIndex;
    chunks.push(str.slice(startIndex, endIndex));
    startIndex = endIndex;
  }

  if (chunks[chunks.length - 1].length + finishedString.length <= chunkSize) {
    chunks[chunks.length - 1] += finishedString;
  } else {
    chunks.push(finishedString);
  }

  return chunks.map(chunk => chunk.trim());
}

export default Home;
