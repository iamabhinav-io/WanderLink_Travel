package com.wanderlink.common.exception;

/**
 * Thrown when attempting to create a resource that already exists (e.g. duplicate email or group membership).
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
