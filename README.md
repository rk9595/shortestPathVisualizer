# Shortest Path Visualizer

A web application that visualizes the shortest path between two points on a grid.

<img width="1440" alt="Screenshot 2024-10-01 at 10 37 07 PM" src="https://github.com/user-attachments/assets/147da175-8720-4b99-ad91-3dddafc7c3d4">


## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/rk9595/shortestPathVisualizer.git
cd shortestPathVisualizer

docker-compose up --build

## Use API
curl -X POST http://localhost:8080/find-path -H "Content-Type: application/json" -d '{"start":{"x":0,"y":0},"end":{"x":19,"y":19}}'
