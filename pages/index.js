import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Home() {
    const [prediction, setPrediction] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: e.target.prompt.value,
            }),
        })
        let prediction = await response.json()
        if (response.status !== 201) {
            setError(prediction.detail)
            return
        }
        setPrediction(prediction)

        while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
            await sleep(1000)
            const response = await fetch('/api/predictions/' + prediction.id)
            prediction = await response.json()
            if (response.status !== 200) {
                setError(prediction.detail)
                return
            }
            console.log({ prediction })
            setPrediction(prediction)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Testing Replica</title>
            </Head>

            <p>Replica says hello:</p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input type='text' name='prompt' placeholder='Enter your name' />
                <button type='submit'>Go!</button>
            </form>

            {error && <div>{error}</div>}

            {prediction && (
                <div>
                    {prediction.output && (
                        <div className={styles.imageWrapper}>
                            <div className={styles.resultWrapper}>{prediction.output}</div>
                            {/* <Image fill src={prediction.output[prediction.output.length - 1]} alt='output' sizes='100vw' /> */}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
