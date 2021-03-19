import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export default class MoviesAction {

    static graphQL(body: string) {
        return new Promise((resolve, reject) => {
            return axios({
                method: 'post',
                url: `${BASE_URL}graphql`,
                data: body
            })
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        })

    }
}
