import React, { useState } from 'react';
import peanut, { getDefaultProvider } from '@squirrel-labs/peanut-sdk';
import { Wallet } from 'ethersv5';

export interface CreateLinkProps {
  chainId: string;
  mnemonic: string;
  tokenAmount: number;
  tokenDecimals: number;
  tokenType: number;
}

const CreateLink: React.FC<CreateLinkProps> = ({ chainId, mnemonic, tokenAmount, tokenDecimals, tokenType }): JSX.Element => {
  const [link, setLink] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLink = async () => {
    setLoading(true);
    setError(null);
    try {
      let wallet = Wallet.fromMnemonic(mnemonic);
      const provider = await getDefaultProvider(chainId);
      wallet = wallet.connect(provider);

      const { link: newLink, txHash } = await peanut.createLink({
        structSigner: {
          signer: wallet
        },
        linkDetails: {
          chainId,
          tokenAmount,
          tokenType,
          tokenDecimals,
        }
      });

      setLink(newLink);
      console.log('Transaction Hash:', txHash);
    } catch (e) {
      setError(`Failed to create link: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return {isLoading, error, link, createLink}
};

export default CreateLink;
