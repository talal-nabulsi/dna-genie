import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return <><Header /><main id="main" className="appmin wrap"><div className="ptitle"><h1>No page at this address</h1></div><Link className="btn" href="/">Go to the start</Link></main><Footer /></>;
}
