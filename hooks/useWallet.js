import { createWallet, injectedProvider } from "thirdweb/wallets";
import { useConnect, useActiveWallet, useActiveAccount, useConnectedWallets } from "thirdweb/react";
import toast from "react-hot-toast";

function useWallet(client) {
    const { connect, isConnecting, error } = useConnect();
    const activeWallet = useActiveWallet()
    const activeAccount = useActiveAccount()
    const connectedWallets = useConnectedWallets()

    console.log('wallet and account >>>>',activeWallet, activeAccount, connectedWallets);

    async function connectToMetamask() {
        try {
            const res = await connect(async () => {
                const wallet = createWallet("io.metamask");
                if (injectedProvider("io.metamask")) {
                    const res = await wallet.connect({ client });
                    console.log("Connected to metamask", res);
                } else {
                    await wallet.connect({
                        client,
                        walletConnect: { showQrModal: true },
                    });
                }
                return wallet;
            });
            console.log('connected to metamask function ', res);
            toast.success('Connected to wallet')
        }
        catch(err) {
            console.log(err);
            toast.error("Failed to connect to wallet");
        }
    }

    return {
        connect,
        isConnecting,
        error,
        activeAccount,
        connectToMetamask,
        address: activeAccount?.address
    };
}

export default useWallet;
