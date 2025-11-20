import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { ToastContainer } from "react-toastify"
import { BrowserRouter } from "react-router-dom"
import DataContext from "./context/DataContext.jsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <DataContext>
        <App />
        <ToastContainer
          position="top-right"
          style={{ top: "60px" }}
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
        />
      </DataContext>
    </QueryClientProvider>
  </BrowserRouter>
)
