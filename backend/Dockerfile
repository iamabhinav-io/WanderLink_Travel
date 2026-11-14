# Stage 1: Build JAR using Maven with Eclipse Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S wanderlink && adduser -S wanderlink -G wanderlink

COPY --from=build /app/target/wanderlink-backend-1.0.0.jar app.jar

USER wanderlink

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
