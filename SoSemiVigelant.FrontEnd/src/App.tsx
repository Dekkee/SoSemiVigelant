import * as React from 'react'

import { AuctionList } from './components/AuctionList'
import { AuctionItemModal } from './components/AuctionItemModal'

import './assets/favicon.ico';
import './App.scss';

export function App() {
    return (
        <main>
            <header>
                <h1>Оукционы!!1один</h1>
            </header>

            <section className="aucs">
                <AuctionList />
                <AuctionItemModal />
            </section>
        </main>
    );
}
