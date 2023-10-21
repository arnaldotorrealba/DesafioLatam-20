import { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export const PokeApi = () => {
    const [selectedValue, setSelectedValue] = useState("type");
    const [secondSelectedValue, setSecondSelectedValue] = useState(
        "https://pokeapi.co/api/v2/type/1"
    );
    const [thirdSelectedValue, setThirdSelectedValue] = useState("");
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

    const orderPokeListBy = (atribute) => {
        let orderedList;
        if (typeof pokeList[0][atribute] === "string") {
            orderedList = [...pokeList].sort((a, b) =>
                a[atribute].localeCompare(b[atribute])
            );
        } else {
            orderedList = [...pokeList].sort(
                (a, b) => a[atribute] - b[atribute]
            );
        }
        setPokeList(orderedList);
    };

    const handleFirstSelectChange = (e) => {
        const selectedOption = e.target.value;
        setSelectedValue(selectedOption);
        selectedOption == "type"
            ? setSecondSelectedValue("https://pokeapi.co/api/v2/type/1/")
            : setSecondSelectedValue("https://pokeapi.co/api/v2/ability/1/");
        setThirdSelectedValue("");
    };

    const handleSecondSelectChange = (e) => {
        const selectedOption = e.target.value;
        setSecondSelectedValue(selectedOption);
        setThirdSelectedValue("");
    };

    const handleThirdSelectChange = (e) => {
        const selectedOption = e.target.value;
        setThirdSelectedValue(selectedOption);

        switch (selectedOption) {
            case "name":
                orderPokeListBy("name");
                break;
            case "weight":
                orderPokeListBy("weight");
                break;
            case "height":
                orderPokeListBy("height");
                break;
            default:
                console.log(
                    "Lo lamentamos, no se puede ordenar por este atributo"
                );
        }
    };

    useEffect(() => {
        searchPokeList();
    }, [selectedValue]);

    useEffect(() => {
        getPokeArray();
    }, [secondSelectedValue]);

    return (
        <div>
            <h1>Listado Pokemon por Tipo y Habilidad</h1>
            <div className="poke-filter">
                <FloatingLabel controlId="floatingSelect" label="Filtre por:">
                    <Form.Select
                        aria-label="Floating label select example"
                        onChange={handleFirstSelectChange}
                        style={{ width: "10rem" }}
                        value={selectedValue}
                    >
                        <option value="type">Tipo</option>
                        <option value="ability">Habilidad</option>
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingSelect"
                    label={`Filtre ${
                        selectedValue === "type" ? "Tipo" : "Habilidad"
                    }`}
                >
                    <Form.Select
                        aria-label="Floating label select example"
                        onChange={handleSecondSelectChange}
                        value={secondSelectedValue}
                        style={{ width: "10rem" }}
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
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect" label="Ordene por:">
                    <Form.Select
                        aria-label="Floating label select example"
                        onChange={handleThirdSelectChange}
                        value={thirdSelectedValue}
                        style={{ width: "10rem" }}
                    >
                        <option>Seleccione</option>
                        <option value="name">Nombre</option>
                        <option value="weight">Peso</option>
                        <option value="height">Altura</option>
                    </Form.Select>
                </FloatingLabel>
            </div>
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
