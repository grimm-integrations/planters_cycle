<div align="center">
<a href="https://github.com/ShaanCoding/ReadME-Generator">
<img src="https://avatars.githubusercontent.com/u/151554346?s=200&v=4" alt="Logo" width="80" height="80">
</a>
<h3 align="center">Planters Cycle</h3>
<p align="center">
A boilerplate project for rust as backend and nextjs for the frontend.
<br/>
<br/>
<a href="https://github.com/grimm-integrations/planters_cycle/wiki"><strong>Explore the docs »</strong></a>
<br/>
<br/>
  
<a href="https://github.com/grimm-integrations/planters_cycle/issues/new?labels=bug&template=bug_report.md">Report Bug .</a>
<a href="https://github.com/grimm-integrations/planters_cycle/issues/new?labels=enhancement&template=feature_request.md&title=feat%3A">Request Feature</a>
</p>
</div>

## About The Project

Of course there are many boilerplate's out there, but none of them covered our expectations. So we decided to start our own.

Here's why:

- We wanted to adapt rust as backend for the lightweight runtime.
- Choosing NextJS for the frontend because of the huge community and the many things you can achieve with it.
- We wanted something *fast*

### Built With

- [Next](https://nextjs.org)
- [React](https://reactjs.org)
- [Rust](https://www.rust-lang.org)
- [Actix](https://actix.rs)
- [Redis](https://redis.io)
- [Postgresql](https://www.postgresql.org)
- [Docker](https://www.docker.com)
- [TailwindCSS](https://tailwindcss.com)
- [ShadCn](https://ui.shadcn.com)

## Getting Started

Here are some steps to setup the project for yourself.

A devcontainer template is also provided for a quick start.
### Prerequisites

We use some *awesome* tools to make this project possible.

- node
- bun
  ```sh
  curl -fsSL https://bun.sh/install | bash
  ```
- rust
  ```sh
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- docker or psql and redis

### Installation

1. Clone the repo
```sh
git clone https://github.com/grimm-integrations/planters_cycle.git
```
2. Install NPM packages
```sh
cd ui && bun install
```
3. Spin up the databases
```sh
docker compose up
```
4. Create the database
```sh
bash ./scripts/create_database.sh
```
5. Generate prisma clients
```sh
cd ui && bunx prisma generate
cd api && cargo prisma generate
```
6. Apply migrations
```sh
cd api && cargo prisma migrate deploy
```
7. Run the api
```sh
cd api && cargo run
```
8. Run the frontend
```sh
cd ui && bun run dev
```

## Roadmap

See the [open issues](https://github.com/grimm-integrations/planters_cycle/issues) for a full list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [MIT License](https://opensource.org/licenses/MIT) for more information.

## Contact

Johannes Grimm - [@metratrj](https://github.com/metratrj) - <grimmjohannes1998@gmail.com>

Project Link: [https://github.com/grimm-integrations/planters_cycle](https://github.com/grimm-integrations/planters_cycle)
