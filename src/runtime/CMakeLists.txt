cmake_minimum_required(VERSION 3.8)
project(undefined)

set(CMAKE_C_STANDARD 99)

set(SOURCE_FILES main.c var_array.h var.h var_array.c var.c io.h io.c std_math.h std_math.c http.h http.c buffer.h buffer.c)
add_executable(c_tests ${SOURCE_FILES})