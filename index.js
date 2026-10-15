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

function criarPet(dsNome, dsEspecie, nuIdade) {
    let novoPet = {
        idPet: pets.length + 1,
        dsNome: dsNome,
        dsEspecie: dsEspecie,
        nuIdade: nuIdade,
        fgAdotado: false
    };
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
    const novoPet = criarPet(dsNome, dsEspecie, nuIdade);

    if (dsNome === undefined || dsEspecie === undefined ) {
        return res.status(400).json({ "mensagem": "..." });

    }

    if (nuIdade === undefined || nuIdade < 0 || nuIdade !== parseInt(nuIdade)) {
        return res.status(400).json({ "mensagem": "..." });
    }
    return res.status(201).json({ "mensagem": "pet criado", "pet": novoPet });
});

app.patch("/pets/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ "mensagem": "identificador deve ser um numero" });
      }

      if (!acharUm(id)) {
        return res
          .status(404).json();
      }
    
      let novo_nome = req.body.dsNome;
      let nova_especie = req.body.dsEspecie;
      let nova_idade = req.body.nuIdade;
      let adotado = req.body.fgAdotado;

      if (req.body === undefined || req.body === null) {
        return res
          .status(400)
          .json({ "mensagem": "..." });
      }

      if (!novo_nome || !nova_especie) {
        return res
          .status(400)
          .json({ "mensagem": "..." });
      }

      if ( fgAdotado !== "boolean") {
        return res
          .status(400)
          .json({ "mensagem": "..." });
      }
    
      let pet_editado = atualizarPet(
        id,
        novo_nome,
        nova_especie,
        nova_idade,
        adotado
      );
    
      return res.status(200).json(pet_editado);
});

app.delete("/pets/:id", (req, res) => {
    const { id } = req.params;
    const petRemovido = deletarPet(parseInt(id));

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ "mensagem": "identificador deve ser um numero" });
    }
    
    if (!petRemovido) {
        return res.status(404).json();
    }
    res.json(petRemovido);
    res.status(204).json();
});

app.listen(3000);
