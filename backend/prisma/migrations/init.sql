-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" SERIAL NOT NULL,
    "transaction_id" VARCHAR(255),
    "user_id" VARCHAR(255),
    "show_id" INTEGER,
    "seat_id" INTEGER,
    "payment_status" VARCHAR(20) DEFAULT 'pending',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "category" VARCHAR(50),
    "organizer_id" VARCHAR(255),
    "image" VARCHAR(255),
    "likes_count" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'ongoing',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "venue_id" INTEGER,
    "seating_plan" VARCHAR,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "likedevents" (
    "user_id" VARCHAR(255) NOT NULL,
    "event_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "organizer_subscriptions" (
    "subscription_id" SERIAL NOT NULL,
    "organizer_email" VARCHAR(255),
    "plan_id" INTEGER,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "payment_status" VARCHAR(20) DEFAULT 'pending',
    "transaction_id" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizer_subscriptions_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "transaction_id" VARCHAR(255) NOT NULL,
    "amount" DOUBLE PRECISION,
    "status" VARCHAR(20) DEFAULT 'pending',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" SERIAL NOT NULL,
    "user_id" VARCHAR(255),
    "event_id" INTEGER,
    "review_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "review_text" VARCHAR(255),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "seating_plans" (
    "plan_id" SERIAL NOT NULL,
    "plan_name" VARCHAR(50) NOT NULL,
    "layout" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seating_plans_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "seats" (
    "seat_number" VARCHAR(20) NOT NULL,
    "show_id" INTEGER,
    "seat_category" VARCHAR(100),
    "price" DOUBLE PRECISION,
    "status" VARCHAR(20) DEFAULT 'available',
    "seat_id" SERIAL NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "shows" (
    "show_id" SERIAL NOT NULL,
    "event_id" INTEGER,
    "venue_id" INTEGER,
    "start_time" VARCHAR(100),
    "end_time" VARCHAR(100),
    "total_seats" INTEGER,
    "show_date" DATE,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("show_id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "plan_id" SERIAL NOT NULL,
    "plan_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "max_events" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "user_interests" (
    "interest_id" SERIAL NOT NULL,
    "user_id" VARCHAR,
    "category" VARCHAR(50),

    CONSTRAINT "user_interests_pkey" PRIMARY KEY ("interest_id")
);

-- CreateTable
CREATE TABLE "users" (
    "name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT,
    "role" TEXT,
    "phone" VARCHAR(15),
    "is_organizer" BOOLEAN DEFAULT false,
    "free_events_remaining" INTEGER DEFAULT 5,
    "current_subscription_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "venues" (
    "venue_id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "address" TEXT,
    "city" VARCHAR(100),

    CONSTRAINT "venues_pkey" PRIMARY KEY ("venue_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_like" ON "likedevents"("user_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_interests_user_id_category_key" ON "user_interests"("user_id", "category");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("seat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("show_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "payment"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("venue_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likedevents" ADD CONSTRAINT "likedevents_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likedevents" ADD CONSTRAINT "likedevents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizer_subscriptions" ADD CONSTRAINT "organizer_subscriptions_organizer_email_fkey" FOREIGN KEY ("organizer_email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizer_subscriptions" ADD CONSTRAINT "organizer_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("plan_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("show_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("venue_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_subscription_id_fkey" FOREIGN KEY ("current_subscription_id") REFERENCES "organizer_subscriptions"("subscription_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

