# syntax=docker/dockerfile:1

# --- Build stage: compile backend and frontend via Maven ---
FROM docker.io/library/maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy Maven descriptor first to leverage layer caching for dependencies
COPY pom.xml ./

# Pre-fetch dependencies to speed up subsequent builds
RUN mvn -B -q -DskipTests dependency:go-offline

# Copy the rest of the project sources (backend + frontend)
COPY . .

# Build the project (frontend built via frontend-maven-plugin; assets copied into Spring Boot static)
RUN mvn -B -DskipTests package

# --- Runtime stage: lightweight JRE image to run the app ---
FROM docker.io/eclipse-temurin@sha256:48b5f4476f7d209de0a38fd43c776162368d04e1b92d0ac9fb452122c5689dc7
WORKDIR /app

# Copy the fat JAR built in the previous stage
COPY --from=build /workspace/target/Demos-1.0.jar /app/app.jar

# Spring Boot default port
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
