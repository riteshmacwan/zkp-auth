// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import * as snarkjs from 'snarkjs';
import { poseidon } from 'circomlib';

@Controller('auth')
export class AuthController {
  private readonly users = new Map();

  @Post('register')
  async register(@Body() body: { username: string; hashedPassword: string }) {
    const { username, hashedPassword } = body;
    this.users.set(username, hashedPassword);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(
    @Body() body: { username: string; proof: string; publicSignals: string },
  ) {
    const { username, proof, publicSignals } = body;
    const storedHash = this.users.get(username);

    if (!storedHash) {
      return { message: 'User not found' };
    }

    const verificationKey = JSON.parse(
      await snarkjs.load('verification_key.json'),
    );
    const isValid = await snarkjs.groth16.verify(
      verificationKey,
      JSON.parse(publicSignals),
      JSON.parse(proof),
    );

    if (isValid) {
      return { message: 'Login successful' };
    } else {
      return { message: 'Invalid credentials' };
    }
  }
}
