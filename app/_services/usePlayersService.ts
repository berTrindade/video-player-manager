import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAlertService } from '_services';
import { useFetch } from '_helpers/client';

export { usePlayerService };

// user state store
const initialState: IPlayerStore = {
    players: undefined,
    player: undefined,
    currentPlayer: undefined
};
const playerStore = create<IPlayerStore>(() => initialState);

function usePlayerService(): IPlayerService {
    const alertService = useAlertService();
    const fetch = useFetch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentPlayer, player, players } = playerStore();

    return {
        players,
        player,
        currentPlayer,
        getAll: async () => {
            playerStore.setState({ players: await fetch.get('/api/players') });
        },
        getById: async (id: string) => {
            playerStore.setState({ player: undefined });
            try {
                playerStore.setState({ player: await fetch.get(`/api/players/${id}`) });
            } catch (error: any) {
                alertService.error(error);
            }
        },
        create: async (player: IPlayer) => {
            console.log('doing create request with ', player)
            await fetch.post('/api/players', player);
        },
        update: async (id: string, params: Partial<IPlayer>) => {
            await fetch.put(`/api/players/${id}`, params);
        },
        delete: async (id: string) => {
            // set isDeleting prop to true on user
            playerStore.setState({
                players: players!.map(x => {
                    if (x.id === id) { x.isDeleting = true; }
                    return x;
                })
            });

            // delete user
            const response = await fetch.delete(`/api/players/${id}`);

            // remove deleted user from state
            playerStore.setState({ players: players!.filter(x => x.id !== id) });
        }
    };
};

// interfaces

interface IPlayer {
    id: string,
    title: string,
    configuration: string,
    isDeleting?: boolean
}

interface IPlayerStore {
    players?: IPlayer[],
    player?: IPlayer,
    currentPlayer?: IPlayer,
}

interface IPlayerService extends IPlayerStore {
    getAll: () => Promise<void>,
    getById: (id: string) => Promise<void>,
    create: (user: IPlayer) => Promise<void>,
    update: (id: string, params: Partial<IPlayer>) => Promise<void>,
    delete: (id: string) => Promise<void>
}