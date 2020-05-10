
function Footer ({GoToSearch, GoToHome, GoToFavs}) {

    const handleGoToSearch= () => {
        GoToSearch()
    }
    const handleGoToHome = () => {
        GoToHome()
    }
    
    const handleGoToFavs = () => { //put state to change color to white on the section your at and not at hover at least for movile
        GoToFavs()
    }

    return <footer className="Footer">
    <section className="Footer__container">
        <i onClick={handleGoToHome} className="fas fa-home fa-2x"></i>
        <i onClick={handleGoToSearch} className="fas fa-search fa-2x"></i>
        <i className="fas fa-map-marked-alt fa-2x"></i>
        <i onClick={handleGoToFavs} className="fas fa-star fa-2x"></i>
    </section>
</footer>

}