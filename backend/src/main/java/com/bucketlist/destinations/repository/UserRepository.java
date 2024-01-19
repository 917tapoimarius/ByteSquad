package com.bucketlist.destinations.repository;

import com.bucketlist.destinations.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByUsernameAndPassword(String username, String password);
}
