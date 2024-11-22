// global.d.ts
declare global {
  let _mongooseGlobal: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

export {};
