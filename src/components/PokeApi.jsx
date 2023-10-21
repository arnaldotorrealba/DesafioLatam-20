import { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

export const PokeApi = () => {
    const [selectedValue, setSelectedValue] = useState("type");
    const [secondSelectedValue, setSecondSelectedValue] = useState(
        "https://pokeapi.co/api/v2/type/1"
    );
    const [pokeData, setPokeData] = useState([]);
    const [pokeList, setPokeList] = useState([]);

    const searchPokeList = () => {
        const apiUrl = `https://pokeapi.co/api/v2/${selectedValue}`;
        axios
            .get(apiUrl)
            .then((response) => {
                console.log("Datos de la API:", response.data.results);
                setPokeData(response.data.results);
            })
            .catch((err) => {
                console.log("Error al obtener datos de la API:", err);
            });
    };

    const getPokeArray = () => {
        const apiUrl = `${secondSelectedValue}`;
        axios
            .get(apiUrl)
            .then((response) => {
                console.log("Datos de la API:", response.data.pokemon);
                // setSecondPokeData(response.data.pokemon);
                getPokeList(response.data.pokemon);
            })
            .catch((err) => {
                console.log("Error al obtener datos de la API:", err);
            });
    };

    const getPoke = async (pokeUrl) => {
        try {
            const response = await axios.get(pokeUrl);
            const pokeData = {
                name: response.data.name,
                height: response.data.height,
                weight: response.data.weight,
                baseExp: response.data.base_experience,
                img: response.data.sprites.front_default
                    ? response.data.sprites.front_default
                    : "./pokeball-01.png",
            };
            return pokeData;
        } catch (err) {
            console.log("Error al obtener datos de la API:", err);
            return null;
        }
    };

    const getPokeList = (data) => {
        const pokePromises = data.map((item) => {
            return getPoke(item.pokemon.url);
        });

        Promise.all(pokePromises)
            .then((pokeArray) => {
                setPokeList(pokeArray);
            })
            .catch((error) => {
                console.log("Error al obtener datos de los Pokemones:", error);
            });
    };

    const handleFirstSelectChange = (e) => {
        const selectedOption = e.target.value;
        setSelectedValue(selectedOption);
        selectedOption == "type"
            ? setSecondSelectedValue("https://pokeapi.co/api/v2/type/1/")
            : setSecondSelectedValue("https://pokeapi.co/api/v2/ability/1/");
    };

    const handleSecondSelectChange = (e) => {
        const selectedOption = e.target.value;
        setSecondSelectedValue(selectedOption);
    };

    useEffect(() => {
        searchPokeList();
    }, [selectedValue]);

    useEffect(() => {
        getPokeArray();
    }, [secondSelectedValue]);

    return (
        <div>
            <Form.Select
                aria-label="Default select example"
                onChange={handleFirstSelectChange}
            >
                <option value="type">Tipo</option>
                <option value="ability">Habilidad</option>
            </Form.Select>
            <Form.Select
                aria-label="Default select example"
                onChange={handleSecondSelectChange}
            >
                {pokeData ? (
                    pokeData.map((item) => {
                        return (
                            <option key={item.name} value={item.url}>
                                {item.name}
                            </option>
                        );
                    })
                ) : (
                    <h1>Not found</h1>
                )}
            </Form.Select>
            <div className="poke-container">
                {pokeList ? (
                    pokeList.map((item) => {
                        return (
                            <Card key={item.name} style={{ width: "12rem" }}>
                                <Card.Img variant="top" src={item.img} />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            Weight: {item.weight} hg.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Height: {item.height} dm.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Exp. base: {item.baseExp}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        );
                    })
                ) : (
                    <h1>Not found</h1>
                )}
            </div>
        </div>
    );
};
