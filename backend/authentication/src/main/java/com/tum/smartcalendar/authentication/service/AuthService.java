package com.tum.smartcalendar.authentication.service;

import com.tum.smartcalendar.authentication.dto.*;
import com.tum.smartcalendar.authentication.model.User;
import com.tum.smartcalendar.authentication.repository.UserRepository;
import com.tum.smartcalendar.authentication.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        // Handle optional studentId - can be null or empty string
        user.setStudentId(request.getStudentId() != null && !request.getStudentId().isEmpty() 
                          ? request.getStudentId() 
                          : null);
        
        user = userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFirstName(), 
                                      user.getLastName(), user.getStudentId());
        
        return new AuthResponse(token, userDto);
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFirstName(), 
                                      user.getLastName(), user.getStudentId());
        
        return new AuthResponse(token, userDto);
    }
}
