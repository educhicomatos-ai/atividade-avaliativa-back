import express from "express";

const app = express();

app.use(express.json());

const pets = [
    {
    "idPet": 1,
    "dsNome": "Rex",
    "dsEspecie": "cachorro",
    "nuIdade": 3,
    "fgAdotado": false
    },

    {
    "idPet": 2,
    "dsNome": "Luna",
    "dsEspecie": "Gato",
    "nuIdade": 3,
    "fgAdotado": false
    },

    {
    "idPet": 3,
    "dsNome": "Bella",
    "dsEspecie": "Coelho",
    "nuIdade": 1,
    "fgAdotado": false
    }
]

function acharTodos() {
    return pets;
}

function acharUm(idPet) {
    let pet = pets.find((p) => {
        return p.idPet === idPet;
    });
    return pet;
}

let proximoId = 4;

function criarPet(dsNome, dsEspecie, nuIdade) {
    const novoPet = { idPet: proximoId++, dsNome, dsEspecie, nuIdade, fgAdotado: false };
    pets.push(novoPet);
    return novoPet;
}

function atualizarPet(idPet, dsNome, dsEspecie, nuIdade, fgAdotado) {
    let pet = acharUm(idPet);
    if (!pet) {
        return null;
    }
    pet.dsNome = dsNome;
    pet.dsEspecie = dsEspecie;
    pet.nuIdade = nuIdade;
    pet.fgAdotado = fgAdotado;
    return pet;
}

function deletarPet(idPet) {
    let index = pets.findIndex((p) => {
        return p.idPet === idPet;
    });
    if (index === -1) {
        return null;
    }
    let petRemovido = pets.splice(index, 1);
    return petRemovido;
}

app.get("/pets", (req, res) => {
    const todosOsPets = acharTodos();
    return res.status(200).json(todosOsPets);
});

app.get("/pets/:id", (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ "mensagem": "identificador deve ser um numero" });
    }
    const pet = acharUm(parseInt(id));
    if (!pet) {
        return res.status(404).json();
    }
    return res.status(200).json(pet);
});

app.post("/pets", (req, res) => {
    const { dsNome, dsEspecie, nuIdade } = req.body;    

    if (!dsNome || !dsEspecie) {
        return res.status(400).json({ mensagem: "nome e espécie são obrigatórios" });
    }

    if (!Number.isInteger(nuIdade) || nuIdade < 0) {
        return res.status(400).json({ mensagem: "idade deve ser um inteiro maior ou igual a 0" });
    }

    const novoPet = criarPet(dsNome, dsEspecie, nuIdade);
    return res.status(201).json({ mensagem: "pet criado", pet: novoPet });
});

app.patch("/pets/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "identificador deve ser um numero" });
    }

    const pet = acharUm(id);
    if (!pet) {
        return res.status(404).json();
    }

    const { dsNome, dsEspecie, nuIdade, fgAdotado } = req.body ?? {};

    if (dsNome !== undefined && !dsNome) {
        return res.status(400).json({ mensagem: "nome inválido" });
    }
    if (dsEspecie !== undefined && !dsEspecie) {
        return res.status(400).json({ mensagem: "espécie inválida" });
    }
    if (nuIdade !== undefined && (!Number.isInteger(nuIdade) || nuIdade < 0)) {
        return res.status(400).json({ mensagem: "idade inválida" });
    }
    if (fgAdotado !== undefined && typeof fgAdotado !== "boolean") {
        return res.status(400).json({ mensagem: "fgAdotado deve ser boolean" });
    }

    if (dsNome !== undefined) pet.dsNome = dsNome;
    if (dsEspecie !== undefined) pet.dsEspecie = dsEspecie;
    if (nuIdade !== undefined) pet.nuIdade = nuIdade;
    if (fgAdotado !== undefined) pet.fgAdotado = fgAdotado;

    return res.status(200).json(pet);
});

app.delete("/pets/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "identificador deve ser um numero" });
    }

    const petRemovido = deletarPet(id);
    if (!petRemovido) {
        return res.status(404).json();
    }

    return res.status(204).send();
});

app.listen(3000);
