import { Button, Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import GenresList from "../../components/GenresList/GenresList"

const GenresListPage = () => {
    return (
        <section className="GenresListPage">

            <Container>
                <div className="d-flex justify-content-between mb-4">
                    <h1 className="yellow">Music Genres</h1>
                    <div className="d-flex justify-content-end mb-3">
                        <Button as={Link} to="/genres/new" variant="light">Add new Genre</Button>
                    </div>
                </div>

                <GenresList />

            </Container>

        </section>
    )
}

export default GenresListPage