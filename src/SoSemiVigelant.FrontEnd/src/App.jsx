import React from 'react'

import AuctionListContainer from './containers/AuctionListContainer'

function App() {
    
    return (
        <main>
            <header>
                <h1>React TODO!1</h1>
            </header>

            <section className="aucs">
                <AuctionListContainer />
            </section>
        </main>
    );
}

export default App