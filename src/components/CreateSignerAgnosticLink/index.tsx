import React, { useState } from 'react'
import peanut from '@squirrel-labs/peanut-sdk'
import { Wallet } from 'ethersv5'

export interface CreateSignerAgnosticLinkProps {
    mnemonic: string
    chainId: string
    tokenAmount: number
    tokenDecimals: number
    tokenType: string
}

const CreateSignerAgnosticLink: React.FC<CreateSignerAgnosticLinkProps> = ({ mnemonic, chainId, tokenAmount, tokenDecimals, tokenType }): JSX.Element => {
    const [link, setLink] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const createLink = async () => {
        try {
            setIsLoading(true)
            setError('')

            let wallet = Wallet.fromMnemonic(mnemonic)
            const provider = await peanut.getDefaultProvider(chainId)
            wallet = wallet.connect(provider)

            const linkDetails = {
                chainId,
                tokenAmount,
                tokenType,
                tokenDecimals,
            };

            const password = await peanut.getRandomString(16);

            const preparedTransactions = await peanut.prepareDepositTxs({
                address: wallet.address,
                linkDetails,
                passwords: [password],
            });

            const transactionHashes = [];

            for (const unsignedTx of preparedTransactions.unsignedTxs) {
                const convertedTx = peanut.peanutToEthersV5Tx(unsignedTx)
                const signedTx = await wallet.sendTransaction(convertedTx)
                transactionHashes.push(signedTx.hash)
            }

            const { links } = await peanut.getLinksFromTx({
                linkDetails,
                passwords: [password],
                txHash: transactionHashes[transactionHashes.length - 1],
            });

            setLink(links[0])
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return {isLoading, error, link, createLink}
}

export default CreateSignerAgnosticLink;
