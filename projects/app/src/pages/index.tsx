import {Hero} from "../components/Hero";
import {Container} from "../components/Container";
import {Footer} from "../components/Footer";
import {Header} from "../components/Header";
import React from "react";

const Index = () => (
  <Container>
    <Header title={"Web3 Template"}/>
    <Hero title={"Welcome to Web3 Template"}/>
    <Footer />
  </Container>
);

export default Index;
