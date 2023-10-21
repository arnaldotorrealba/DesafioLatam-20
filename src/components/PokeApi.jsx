import { useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Buscador } from "./Buscador";

export const PokeApi = () => {
    const [pokeData, setPokeData] = useState([]);
    const [pokeList, setPokeList] = useState([]);

    const searchPokeList = (selectedValue) => {
        const apiUrl = `https://pokeapi.co/api/v2/${selectedValue}`;
        axios
            .get(apiUrl)
            .then((response) => {
                setPokeData(response.data.results);
            })
            .catch((err) => {
                console.log("Error al obtener datos de la API:", err);
            });
    };

    const getPokeArray = (secondSelectedValue) => {
        const apiUrl = `${secondSelectedValue}`;
        axios
            .get(apiUrl)
            .then((response) => {
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

    return (
        <div>
            <h1>Listado Pokemon por Tipo y Habilidad</h1>
            <Buscador
                pokeData={pokeData}
                pokeList={pokeList}
                searchPokeList={searchPokeList}
                getPokeArray={getPokeArray}
                setPokeList={setPokeList}
            />
            <div className="poke-container">
                {pokeList ? (
                    pokeList.map((item) => {
                        return (
                            <Card
                                key={item.name}
                                className="bg-dark text-white"
                                style={{ width: "15rem" }}
                            >
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
