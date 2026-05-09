package study_appliaction.study_together_app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.web.*;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

            // ✅ DISABLE CSRF
            .csrf(csrf -> csrf.disable())

            // ✅ ENABLE CORS
            .cors(cors -> {})

            // ✅ DISABLE LOGIN
            .httpBasic(httpBasic -> httpBasic.disable())

            .formLogin(form -> form.disable())

            .authorizeHttpRequests(auth -> auth

                // 🔥 VERY IMPORTANT FIX
                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()

                // PUBLIC ROUTES
                .requestMatchers("/api/auth/**").permitAll()

                .requestMatchers("/api/profile/**").permitAll()

                .requestMatchers("/api/feedback/**").permitAll()

                .requestMatchers("/api/rooms/**").permitAll()

                .requestMatchers("/api/messages/**").permitAll()

                .requestMatchers("/api/private-messages/**").permitAll()

                .requestMatchers("/achievements/**").permitAll()

                .requestMatchers("/streak/**").permitAll()

                .requestMatchers("/planner/**").permitAll()

                .requestMatchers("/ws/**").permitAll()

                .requestMatchers("/topic/**").permitAll()

                .requestMatchers("/uploads/**").permitAll()

                .requestMatchers("/api/profiles").permitAll()

                .requestMatchers("/api/profile/all").permitAll()

                .requestMatchers("/api/connections/**").permitAll()

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}