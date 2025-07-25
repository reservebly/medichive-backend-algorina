import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🎉 Database connected successfully!');
      console.log('📊 PostgreSQL connection established');
      
      // Test the connection with a simple query
      const result = await this.$queryRaw`SELECT current_database() as database_name`;
      console.log(`📁 Connected to database: ${result[0].database_name}`);
      
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    console.log('🔌 Closing database connection...');
    await this.$disconnect();
  }
}
