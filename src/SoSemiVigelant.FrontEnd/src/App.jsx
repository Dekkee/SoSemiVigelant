import React from 'react'

import AuctionListContainer from './containers/AuctionListContainer'
import AuctionItemModalContainer from './containers/AuctionItemModalContainer'

function App() {
    
    return (
        <main>
            <header>
                <h1>Оукционы!!1один</h1>
            </header>

            <section className="aucs">
                <AuctionListContainer />
                <AuctionItemModalContainer />
            </section>
        </main>
    );
}

export default App