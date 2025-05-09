import React, { useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import styled from "styled-components";
import HeroImg from "../../../assets/Lading/Hero/HeroImg.png";
import Lottie from "lottie-react";
import ShieldAnimation from "../../../assets/Lading/Hero/Warranty-3.json";
import CalendarAnimation from "../../../assets/Lading/Hero/calendar.json";
import FileAnimation from "../../../assets/Lading/Hero/file.json";
import ReportAnimation from "../../../assets/Lading/Hero/Report V2.json";
import SecurityAnimation from "../../../assets/Lading/Hero/Security.json";

// Contenedor de 575 x 575 (antes era 650 x 650)
const Container = styled.div`
  width: 100%;
  max-width: 575px;
  aspect-ratio: 1/1;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;

  @media (max-width: 992px) {
    max-width: 500px;
  }

  @media (max-width: 768px) {
    max-width: 450px;
  }

  @media (max-width: 576px) {
    max-width: 100%;
  }
`;

const MainContent = styled.main`
  width: 100%;
  height: 100%;
  position: relative;
`;

// Fondo que ocupa todo el contenedor y permite ver el overflow de los cards
const BackgroundContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Tarjeta compacta: ancho 200px, padding reducido
const Card = styled(motion.div)`
  background-color: white;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 200px;

  @media (max-width: 768px) {
    width: 180px;
  }

  @media (max-width: 576px) {
    width: 150px;
  }
`;

// Tarjeta circular para la animación del escudo - Reducida de 110px a 90px
const CircleCard = styled(motion.div)`
  background-color: white;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 0;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 576px) {
    width: 70px;
    height: 70px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: ${(props) => props.$alignItems || "center"};
  gap: ${(props) => props.$gap || "0.75rem"};
  justify-content: ${(props) => props.$justifyContent || "flex-start"};
`;

const IconWrapper = styled.div`
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px; // Asegura que todos los iconos tengan el mismo ancho base
`;

const Title = styled.h3`
  font-weight: bold;
  font-size: 0.8rem;
  margin: 0;
  padding: 0;

  @media (max-width: 576px) {
    font-size: 0.7rem;
  }
`;

const SubText = styled.p`
  font-size: 0.75rem;
  color: #4b5563;
  margin: 0.25rem 0 0 0;
  padding: 0;

  @media (max-width: 576px) {
    font-size: 0.65rem;
  }
`;

const StatusDot = styled.div`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background-color: #6366f1;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.4rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  background-color: black;
  width: 75%;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;

  @media (max-width: 576px) {
    font-size: 0.65rem;
  }
`;

const DetailValue = styled.span`
  font-size: 0.75rem;

  @media (max-width: 576px) {
    font-size: 0.65rem;
  }
`;

// Imagen de fondo (ocupa todo el contenedor)
const CenterImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;

function Hero_ParallexEffect() {
  // Valores para el efecto parallax
  const regX = useMotionValue(0);
  const regY = useMotionValue(0);
  const renewalX = useMotionValue(0);
  const renewalY = useMotionValue(0);
  const gpsX = useMotionValue(0);
  const gpsY = useMotionValue(0);
  const licenseX = useMotionValue(0);
  const licenseY = useMotionValue(0);
  const securityX = useMotionValue(0);
  const securityY = useMotionValue(0);

  // Agregar un estado para detectar tamaño de pantalla
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkSize(); // Verificar al inicio
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Ajustar la intensidad del efecto parallax según el tamaño de pantalla
  const getParallaxIntensity = () => {
    if (window.innerWidth < 576) return 0.5; // Menor intensidad en móviles
    if (window.innerWidth < 992) return 0.7; // Intensidad media en tablets
    return 1; // Intensidad completa en desktop
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      const intensity = getParallaxIntensity();

      regX.set(mouseX * -30 * intensity);
      regY.set(mouseY * -30 * intensity);
      renewalX.set(mouseX * 30 * intensity);
      renewalY.set(mouseY * 30 * intensity);
      gpsX.set(mouseX * 40 * intensity);
      gpsY.set(mouseY * 40 * intensity);
      licenseX.set(mouseX * -20 * intensity);
      licenseY.set(mouseY * -20 * intensity);
      securityX.set(mouseX * 15 * intensity);
      securityY.set(mouseY * 15 * intensity);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [regX, regY, renewalX, renewalY, gpsX, gpsY, licenseX, licenseY, securityX, securityY]);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
      opacity: 1,
      transition: { delay: custom * 0.2, duration: 0.5 },
    }),
  };

  return (
    <Container>
      <MainContent>
        <BackgroundContainer>
          {/* ----- COL. IZQUIERDA (3 cards) ----- */}
          {/* Card 1 (totalmente dentro) */}
          <motion.div
            style={{
              position: "absolute",
              top: isMobile ? "15%" : "100px", 
              left: isMobile ? "5%" : "20px",
              zIndex: 10,
              x: regX,
              y: regY,
            }}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <Card>
              <FlexContainer>
                <IconWrapper style={{ width: "40px", height: "40px" }}>
                  <Lottie 
                    animationData={ReportAnimation} 
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </IconWrapper>
                <div>
                  <Title>Estado de Registro</Title>
                  <FlexContainer $gap="0.5rem" style={{ marginTop: "0.25rem" }}>
                    <StatusDot />
                    <SubText>Activo hasta 2025</SubText>
                  </FlexContainer>
                </div>
              </FlexContainer>
            </Card>
          </motion.div>

          {/* Card 2 (en el borde: medio dentro, medio fuera) */}
          <motion.div
            style={{
              position: "absolute",
              top: isMobile ? "40%" : "250px",
              left: isMobile ? "-15%" : "-100px",
              zIndex: 10,
              x: renewalX,
              y: renewalY,
              display: window.innerWidth < 576 ? "none" : "block", // Ocultar en pantallas muy pequeñas
            }}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Card>
              <FlexContainer>
                <IconWrapper style={{ width: "36px", height: "36px" }}>
                  <Lottie 
                    animationData={CalendarAnimation} 
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </IconWrapper>
                <div>
                  <Title>Fecha de Renovación</Title>
                  <SubText>15 Oct, 2025</SubText>
                </div>
              </FlexContainer>
            </Card>
          </motion.div>

          {/* Implementamos la tarjeta circular con animación Lottie */}
          <motion.div
            style={{
              position: "absolute",
              top: isMobile ? "70%" : "400px",
              left: isMobile ? "-20%" : "-150px",
              zIndex: 10,
              x: gpsX,
              y: gpsY,
              display: window.innerWidth < 576 ? "none" : "block", // Ocultar en pantallas muy pequeñas
            }}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <CircleCard>
              <Lottie 
                animationData={ShieldAnimation} 
                loop={true}
                style={{ width: 80, height: 80 }} // Reducido de 90px a 70px
              />
            </CircleCard>
          </motion.div>

          {/* ----- COL. DERECHA (2 cards) ----- */}
          {/* Card 4 (adelantado: saliendo por la derecha) */}
          <motion.div
            style={{
              position: "absolute",
              top: isMobile ? "30%" : "200px",
              right: isMobile ? "-15%" : "-100px",
              zIndex: 10,
              x: licenseX,
              y: licenseY,
              display: window.innerWidth < 576 ? "none" : "block", // Ocultar en pantallas muy pequeñas
            }}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <Card>
              <FlexContainer>
              <IconWrapper style={{ width: "40px", height: "40px" }}>
                  <Lottie 
                    animationData={FileAnimation} 
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </IconWrapper>
                <Title>Detalles de Licencia</Title>
              </FlexContainer>
              <div style={{ marginTop: "0.5rem" }}>
                <DetailRow>
                  <DetailLabel>Placa:</DetailLabel>
                  <DetailValue>ABC-123</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Tipo:</DetailLabel>
                  <DetailValue>Sport</DetailValue>
                </DetailRow>
              </div>
            </Card>
          </motion.div>

          {/* Card 5 - Protección de Seguridad con Security.json */}
          <motion.div
            style={{
              position: "absolute",
              bottom: isMobile ? "10%" : "50px",
              right: isMobile ? "5%" : "20px",
              zIndex: 10,
              x: securityX,
              y: securityY,
            }}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            <Card>
              <FlexContainer>
                <IconWrapper style={{ width: "48px", height: "48px" }}> {/* Increased from 36px to 48px */}
                  <Lottie 
                    animationData={SecurityAnimation} 
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </IconWrapper>
                <div>
                  <Title>Protección de Seguridad</Title>
                  <SubText>Activa hasta 2025</SubText>
                </div>
              </FlexContainer>
            </Card>
          </motion.div>

          {/* Imagen de fondo */}
          <CenterImageContainer>
            <HeroImage src={HeroImg} alt="Motorcycle tracking system" />
          </CenterImageContainer>
        </BackgroundContainer>
      </MainContent>
    </Container>
  );
}

export default Hero_ParallexEffect;
