import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { generateCleanArray } from "../../utils/genres-utils"

const API_URL = import.meta.env.VITE_API_URL


const EditGenreForm = () => {

    const [formValues, setFormValues] = useState({
        name: "",
        origins: {},
        description: "",
        linkedBands: "",
        isMainstream: false,
        parentGenre: "",
        childrenGenres: [],
        images: [],
        rate: 0
    })

    const [originsValues, setOriginsValues] = useState({
        date: 0,
        countries: [],
    })

    const navigate = useNavigate()

    const { genreId } = useParams()

    useEffect(() => {
        fetchFormData()
    }, [])

    const fetchFormData = () => {
        axios
            .get(`${API_URL}/genres/${genreId}`)
            .then(({ data }) => {

                setOriginsValues({
                    date: data.origins.date,
                    countries: data.origins.countries.toString()
                })

                setFormValues({
                    ...data,
                    origins: originsValues,
                    linkedBands: data.linkedBands.toString(),
                    childrenGenres: data.childrenGenres.toString()
                })
            })
            .catch(err => console.log(err))
    }

    const handleFormValues = event => {

        const { value, checked, name } = event.target

        Object.keys(originsValues).includes(name)
            ?
            setOriginsValues({
                ...originsValues,
                [name]: value
            })
            :
            setFormValues({
                ...formValues,
                [name]: !checked ? value : checked
            })
    }

    const handleUrlsList = (event, idx) => {
        const { value } = event.target
        const formValuesImagesCopy = [...formValues.images]
        formValuesImagesCopy[idx] = value
        setFormValues({ ...formValues, images: formValuesImagesCopy })
    }

    const addNewUrl = () => {
        setFormValues({ ...formValues, images: [...formValues.images, ''] })
    }

    const handleDeleteImage = (event, idx) => {
        const formValuesImagesCopy = [...formValues.images]
        formValuesImagesCopy.splice(idx, 1)
        setFormValues({ ...formValues, images: formValuesImagesCopy })
    }

    const handleSubmit = event => {

        event.preventDefault()

        formValues.origins.countries = generateCleanArray(originsValues.countries)
        formValues.origins.date = originsValues.date
        formValues.linkedBands = generateCleanArray(formValues.linkedBands)
        formValues.childrenGenres = generateCleanArray(formValues.childrenGenres)
        formValues.rate = 0

        const requestBody = { ...formValues }

        axios
            .put(`${API_URL}/genres/${genreId}`, requestBody)
            .then(res => navigate('/genres'))
            .catch(err => console.log(err))
    }

    const handleDeleteGenre = () => {
        axios
            .delete(`${API_URL}/genres/${genreId}`)
            .then(res => navigate('/genres'))
            .catch(err => console.log(err))
    }
    return (
        <div className="EditGenreForm" >

            <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="nameId">
                    <Form.Label>Name:<sup>*</sup></Form.Label>
                    <Form.Control
                        onChange={handleFormValues}
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={formValues.name}
                        required />
                </Form.Group>

                <p className="fw-bold text-uppercase">Origins:</p>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="dateId">
                            <Form.Label>Date:<sup>*</sup></Form.Label>
                            <Form.Control
                                onChange={handleFormValues}
                                type="number"
                                name="date"
                                value={originsValues.date}
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="countryId">
                            <Form.Label>Countries:<sup>*</sup></Form.Label>
                            <Form.Control
                                onChange={handleFormValues}
                                type="text"
                                placeholder="Type countries separated with commas"
                                name="countries"
                                value={originsValues.countries}
                                required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="descriptionId">
                    <Form.Label>Description:<sup>*</sup></Form.Label>
                    <Form.Control
                        as="textarea"
                        onChange={handleFormValues}
                        rows={3}
                        placeholder="Write a description (max 400 characters) "
                        maxLength={400}
                        name="description"
                        value={formValues.description}
                        required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="linkedBandsId">
                    <Form.Label>Linked Bands:<sup>*</sup></Form.Label>
                    <Form.Control
                        onChange={handleFormValues}
                        type="text"
                        placeholder="Type the bands separated with commas"
                        name="linkedBands"
                        value={formValues.linkedBands}
                        required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="mainstreamId">
                    <Form.Check
                        onChange={handleFormValues}
                        type="checkbox"
                        label="Is mainstream?:"
                        name="isMainstream"
                        checked={formValues.isMainstream == true} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="parentGenreId">
                    <Form.Label>Parent genre:</Form.Label>
                    <Form.Control
                        onChange={handleFormValues}
                        type="text"
                        placeholder="Enter the parent Genre if exists"
                        name="parentGenre"
                        value={formValues.parentGenre} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="childrenGenresId">
                    <Form.Label>Children genres</Form.Label>
                    <Form.Control
                        onChange={handleFormValues}
                        type="text"
                        placeholder="Type the genres separated with commas"
                        name="childrenGenres"
                        value={formValues.childrenGenres} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="">
                    <Form.Label>Images</Form.Label>
                    {
                        formValues.images.map((image, idx) => {
                            return (
                                <InputGroup key={`urls-${idx}`} className="mb-3" >
                                    <Form.Control
                                        onChange={event => handleUrlsList(event, idx)}
                                        type="text"
                                        placeholder="type image URL"
                                        name="images"
                                        value={formValues.images[idx]}
                                        aria-describedby="Image url" />
                                    <Button onClick={event => handleDeleteImage(event, idx)} variant="outline-danger" id="delete-image-btn">
                                        Delete url
                                    </Button>
                                </InputGroup>
                            )
                        })
                    }
                    <div className="d-flex justify-content-center">
                        <Button onClick={addNewUrl} variant="light" size="sm">Add image</Button>
                    </div>
                </Form.Group>
                <Stack direction="horizontal" gap={3} className="justify-content-between">
                    <Button variant="outline-light" type="submit">Save changes</Button>
                    <Button variant="outline-danger" className="shadow" onClick={() => confirm("Are you sure?") && handleDeleteGenre()}>Remove Genre from Data base</Button>

                </Stack>

            </Form>
        </div>
    )
}
export default EditGenreForm
