# biaori-vocab

**Accessible at https://sandman-ren.github.io/biaori-vocab/**


This repository contains a simple helper tool for learning vocabulary from 标准日本语（第二版） (Standard Japanese, Second Edition). It is built using [Next.js](https://nextjs.org) and leverages modern web technologies to provide an interactive and efficient learning experience.

This is simply a [DataTables's React Component](https://datatables.net/manual/react) using [the words.json in smartsl/biaori](https://github.com/smartsl/biaori/blob/main/words.json). **This page wouldn't exist if not for this piece of data.** Many thanks to [smartsl](https://github.com/smartsl) and their repo [smartsl/biaori](https://github.com/smartsl/biaori)

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or an alternative package manager like `yarn`, `pnpm`, or `bun`.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sandman-Ren/biaori-vocab.git
   cd biaori-vocab
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

You can start editing the application by modifying the `app/page.tsx` file. The page auto-updates as you save changes.

## Building for Production

To build the project for production:

```bash
npm run build
```

This will create an optimized production build in the `.next` directory. You can then start the production server with:

```bash
npm run start
```

## Linting and Code Quality

To run the linter and ensure code quality:

```bash
npm run lint
```

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org) (v15.2.4)
- **Frontend**: [React](https://reactjs.org) (v19.0.0)
- **Styling**: [TailwindCSS](https://tailwindcss.com) and [DaisyUI](https://daisyui.com)
- **DataTables**: [datatables.net-dt](https://datatables.net/) and [datatables.net-react](https://github.com/jbetancur/react-data-table-component)

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [React Documentation](https://reactjs.org/docs/getting-started.html) - Learn about React.
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - Learn about TailwindCSS.
- [DataTables Documentation](https://datatables.net/) - Learn about DataTables.

## Acknowledgements

- As stated at the beginning of this README, this page would not be possible without the data in [smartsl/biaori](https://github.com/smartsl/biaori). Thanks again for their contribution.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---
Happy learning!
