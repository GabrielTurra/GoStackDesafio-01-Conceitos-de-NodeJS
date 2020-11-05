const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id: idRequest } = request.params;
  let { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == idRequest);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: repositories[0] });
  }

  typeof(title)  == 'undefined' ? title = repositories[repositoryIndex].title : title = title;
  typeof(url)    == 'undefined' ? url   = repositories[repositoryIndex].url   : url = url;
  typeof(techs)  == 'undefined' ? techs = repositories[repositoryIndex].techs : techs = techs;

  const repository = {
    id: repositories[repositoryIndex].id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
