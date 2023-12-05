'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAlertService, usePlayerService } from '_services';
import { FluidPlayerConfigurator } from '_components/FluidPlayerConfigurator';
import { useState } from 'react';
import { ConfiguratorOptions } from '_models';

export { AddEdit };

function AddEdit({ title, player }: { title: string, player?: any }) {
    const router = useRouter();
    const alertService = useAlertService();
    const playerService = usePlayerService();
    const [currentPlayer, setCurrentPlayer] = useState<ConfiguratorOptions>(player);

    // get functions to build form with useForm() hook

    async function onSubmit() {
        alertService.clear();
        try {
            // create or update user based on user prop

            const payload = {
                configuration: currentPlayer.options,
                title: currentPlayer.title,
                videoUrl: currentPlayer.videoUrl
            }

            let message;
            if (player) {
                await playerService.update(player.id, payload as any);
                message = 'Player updated';
            } else {
                await playerService.create(payload as any);
                message = 'Player added';
            }

            // redirect to user list with success message
            router.push('/players');
            alertService.success(message, true);
        } catch (error: any) {
            alertService.error(error);
        }
    }

    return (
        <div>
            <h1>{title}</h1>
            <FluidPlayerConfigurator 
                configuration={currentPlayer}
                onSave={(data) => setCurrentPlayer({ ...currentPlayer, ...data })}
            />
            <div className="mb-3">
                <button type="button" className="btn btn-primary me-2" onClick={onSubmit}>
                    Save
                </button>
                {/* <button onClick={() => reset()} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button> */}
                <Link href="/players" className="btn btn-link">Cancel</Link>
            </div>
        </div>
    );
}