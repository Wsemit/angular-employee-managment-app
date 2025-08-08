[README.md](https://github.com/user-attachments/files/21685153/README.md)
# 🆔 Angular Employee Management App

A clean, customizable Employee Management System built with Angular.  
Live demo deployed on Vercel: [https://angular-employee-managment-app.vercel.app](https://angular-employee-managment-app.vercel.app)

---

## 🚀 Features

- **Clean & Modern UI** with reactive search and sorting in real-time  
- **Flexible Employee Cards** — toggle between default and custom templates  
- **Full CRUD** support: add, edit, delete employees easily  
- **Optimized Stack**: Angular CLI, Reactive Forms, RxJS, component-driven architecture  
- **Vercel Deployment Ready** — automatic deployment on push to GitHub  

---

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/Wsemit/angular-employee-managment-app.git
cd angular-employee-managment-app
npm install
npm start
# or
npx ng serve
```

Open your browser at http://localhost:4200 to explore the app locally.

---

## Build & Deployment

Build the app for production:

```bash
ng build --prod
```

The output will be in the `dist/` folder, ready for deployment.  

The project is already set up for deployment on Vercel — just push your changes and watch it live at https://angular-employee-managment-app.vercel.app!

---

## Development Tips

- Generate components:

  ```bash
  ng generate component component-name
  ```

- Generate services:

  ```bash
  ng generate service service-name
  ```

- Run tests:

  ```bash
  ng test
  ng e2e
  ```

---

## Project Structure

```
src/
└── app/
    ├── components/
    │   ├── employee-card/
    │   └── employee-list/
    ├── services/
    │   └── employee.service.ts
    └── models/
        └── employee.interface.ts
app.component.ts - main entry point managing views
```

---

## Contributing

Love this project? Want to contribute?  

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "feat: add new feature"`)  
4. Push to your branch (`git push origin feature/your-feature`)  
5. Open a Pull Request  

---
