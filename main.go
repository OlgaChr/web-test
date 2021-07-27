package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

const BASE_URL = "https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script"

type HttpClient struct {
	client *http.Client
}

func newHttpClient() HttpClient {
	return HttpClient{
		client: &http.Client{},
	}
}

func (hc *HttpClient) getData(url string) (body []byte, err error) {
	// создаем get запрос
	req, err := http.NewRequest("GET", BASE_URL+url, nil)
	if err != nil {
		return make([]byte, 0), err
	}
	// выполняем запрос
	resp, err := hc.client.Do(req)

	body, err = ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return make([]byte, 0), err
	}

	return body, nil
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		client := newHttpClient()
		body, err := client.getData("/users")
		if err != nil {
			fmt.Fprintf(w, string(err.Error()))
			return
		}
		fmt.Fprintf(w, string(body))
	default:
		fmt.Fprintf(w, string(make([]byte, 0)))
	}
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		client := newHttpClient()
		body, err := client.getData("/tasks")
		if err != nil {
			fmt.Fprintf(w, string(err.Error()))
			return
		}
		fmt.Fprintf(w, string(body))
	default:
		fmt.Fprintf(w, string(make([]byte, 0)))
	}
}

func main() {
	http.HandleFunc("/api/users", getUsers)
	http.HandleFunc("/api/tasks", getTasks)

	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.ListenAndServe(":8080", nil)
}
