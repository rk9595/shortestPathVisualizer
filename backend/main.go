package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type PathRequest struct {
	Start Point `json:"start"`
	End   Point `json:"end"`
}

func main() {
	r := mux.NewRouter()

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("../frontend/build/"))))

	r.HandleFunc("/find-path", findPathHandler).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	handler := c.Handler(r)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func findPathHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request at /find-path")

	var req PathRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Printf("Start: %+v, End: %+v\n", req.Start, req.End)

	path := findPath(req.Start, req.End)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(path)
}

func findPath(start, end Point) []Point {
	visited := make(map[Point]bool)
	path := []Point{}
	if dfs(start, end, &visited, &path) {
		return path
	}
	return []Point{}
}

func dfs(current, end Point, visited *map[Point]bool, path *[]Point) bool {
	if current == end {
		*path = append(*path, current)
		return true
	}

	(*visited)[current] = true
	*path = append(*path, current)

	directions := []Point{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
	for _, dir := range directions {
		next := Point{current.X + dir.X, current.Y + dir.Y}
		if next.X >= 0 && next.X < 20 && next.Y >= 0 && next.Y < 20 && !(*visited)[next] {
			if dfs(next, end, visited, path) {
				return true
			}
		}
	}

	*path = (*path)[:len(*path)-1]
	return false
}
