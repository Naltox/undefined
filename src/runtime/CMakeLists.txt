cmake_minimum_required(VERSION 3.8)
project(c_tests)

set(CMAKE_C_STANDARD 99)

set(SOURCE_FILES main.c var_array.h var.h var_array.c var.c)
add_executable(c_tests ${SOURCE_FILES})