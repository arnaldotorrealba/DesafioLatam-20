import { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

export const Buscador = ({
    pokeData,
    pokeList,
    searchPokeList,
    getPokeArray,
    setPokeList,
}) => {
    const [firstSelectedValue, setFirstSelectedValue] = useState("type");
    const [secondSelectedValue, setSecondSelectedValue] = useState(
        "https://pokeapi.co/api/v2/type/1"
    );
    const [thirdSelectedValue, setThirdSelectedValue] = useState("");

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
        setFirstSelectedValue(selectedOption);
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
        }
    };

    useEffect(() => {
        searchPokeList(firstSelectedValue);
    }, [firstSelectedValue]);

    useEffect(() => {
        getPokeArray(secondSelectedValue);
    }, [secondSelectedValue]);

    return (
        <div className="poke-filter">
            <FloatingLabel controlId="floatingSelect" label="Filtre por:">
                <Form.Select
                    aria-label="Floating label select example"
                    onChange={handleFirstSelectChange}
                    style={{ width: "10rem" }}
                    value={firstSelectedValue}
                >
                    <option value="type">Tipo</option>
                    <option value="ability">Habilidad</option>
                </Form.Select>
            </FloatingLabel>
            <FloatingLabel
                controlId="floatingSelect"
                label={`Filtre ${
                    firstSelectedValue === "type" ? "Tipo" : "Habilidad"
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
    );
};
