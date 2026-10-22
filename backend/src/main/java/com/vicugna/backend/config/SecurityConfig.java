
package com.vicugna.backend.config;

import com.vicugna.backend.security.JwtAuthenticationFilter;
import com.vicugna.backend.security.CustomUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtFilter,
            CustomUserDetailsService userDetailsService) {

        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(provider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers("/error").permitAll()
            	    .requestMatchers("/api/auth/**").permitAll()

            	    .requestMatchers("/api/tours/admin/**")
            	        .hasRole("ADMIN")

            	    .requestMatchers(HttpMethod.GET, "/api/tours/**")
            	        .permitAll()

            	    .requestMatchers(HttpMethod.POST, "/api/tours/**")
            	        .hasRole("ADMIN")

            	    .requestMatchers(HttpMethod.PUT, "/api/tours/**")
            	        .hasRole("ADMIN")

            	    .requestMatchers(HttpMethod.PATCH, "/api/tours/**")
            	        .hasRole("ADMIN")

            	    .requestMatchers(HttpMethod.DELETE, "/api/tours/**")
            	        .hasRole("ADMIN")

            	    .requestMatchers("/api/admin/**")
            	        .hasRole("ADMIN")
            	        
            	    .requestMatchers( HttpMethod.GET,"/api/salidas/tour/*")
            	        .permitAll()
            	    
            	    .requestMatchers("/api/salidas/**")
            	        .hasRole("ADMIN")
            	        
            	    .requestMatchers("/api/pagos/**")
            	      	.hasRole("ADMIN")
            	      
            	    .requestMatchers("/api/comprobantes/**")
            	    	.hasRole("ADMIN")

					.requestMatchers(
					        org.springframework.http.HttpMethod.GET,
					        "/api/resenas/tour/*",
					        "/api/resenas/tour/*/resumen"
					).permitAll()
					
					.requestMatchers(
					        org.springframework.http.HttpMethod.POST,
					        "/api/resenas"
					).hasAnyRole("CLIENTE", "ADMIN")
					
					.requestMatchers(
					        org.springframework.http.HttpMethod.GET,
					        "/api/resenas/mis-resenas"
					).hasAnyRole("CLIENTE", "ADMIN")
					
					.requestMatchers(
					        org.springframework.http.HttpMethod.GET,
					        "/api/resenas"
					).hasRole("ADMIN")
					
					.requestMatchers(
					        org.springframework.http.HttpMethod.DELETE,
					        "/api/resenas/*"
					).hasRole("ADMIN")
					.requestMatchers("/api/dashboard/**")
					.hasRole("ADMIN")

            	    .anyRequest().authenticated()
            	)
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
