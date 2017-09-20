#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include "var.h"
#include "var_array.h"


var NaN() {
    var v;

    v.type = NAN_TYPE;

    return  v;
}



var varFromString(char* str) {
    var v;

    v.value.s = str;
    v.type = STRING_TYPE;

    return  v;
}

var varFromBool(bool b) {
    var v;

    v.value.b = b;
    v.type = BOOLEAN_TYPE;

    return  v;
}

var newArray() {
    var v;

    var_array* arr = malloc(sizeof(var_array));

    v.value.ar = arr;
    v.type = ARRAY_TYPE;

    var_array_init(&v);

    return v;
}

bool isTrue(var v) {
    if (v.type == INTEGER_TYPE) {
        return v.value.i > 0;
    }

    if (v.type == BOOLEAN_TYPE) {
        return v.value.b;
    }

    return false;
}

var readLine() {
    char* line = malloc(1024);
    scanf(" %[^\n]s",line);

    return varFromString(line);
}

int getInt(var v) {
    return  v.value.i;
}



void freeTempString(var v, char* str) {
    if (
        v.type != STRING_TYPE &&
        v.type != BOOLEAN_TYPE &&
        v.type != NAN_TYPE
    ) {
        free(str);
    }
}

var std_plus(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromInt(lhs.value.i + rhs.value.i);
    }
    if (lhs.type == STRING_TYPE && rhs.type == INTEGER_TYPE) {
        char* rhsStr = var2str(rhs);


        char* new_str;
        if((new_str = malloc(strlen(lhs.value.s)+strlen(rhsStr)+1)) != NULL){
            new_str[0] = '\0';   // ensures the memory is an empty string
            strcat(new_str,lhs.value.s);
            strcat(new_str,rhsStr);

            //var result = varFromString(new_str);

            return varFromString(new_str);
        } else {
            printf("malloc failed!\n");
        }
    }
    if (lhs.type == INTEGER_TYPE && rhs.type == STRING_TYPE) {
        char* lhsStr = var2str(lhs);


        char* new_str;
        if((new_str = malloc(strlen(rhs.value.s)+strlen(lhsStr)+1)) != NULL){
            new_str[0] = '\0';   // ensures the memory is an empty string
            strcat(new_str,lhsStr);
            strcat(new_str,rhs.value.s);

            //var result = varFromString(new_str);

            return varFromString(new_str);
        } else {
            printf("malloc failed!\n");
        }
    }
    if (lhs.type == STRING_TYPE && rhs.type == STRING_TYPE) {
        char* new_str;
        if((new_str = malloc(strlen(lhs.value.s)+strlen(lhs.value.s)+1)) != NULL){
            new_str[0] = '\0';   // ensures the memory is an empty string
            strcat(new_str,lhs.value.s);
            strcat(new_str,rhs.value.s);

            //var result = varFromString(new_str);

            return varFromString(new_str);
        } else {
            printf("malloc failed!\n");
        }
    }
    if (lhs.type == BOOLEAN_TYPE && rhs.type == BOOLEAN_TYPE) {
        return varFromBool(lhs.value.b + rhs.value.b);
    }
}

var std_minus(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromInt(lhs.value.i - rhs.value.i);
    }
    if (lhs.type == STRING_TYPE || rhs.type == STRING_TYPE) {
        return  NaN();
    }
    if (lhs.type == BOOLEAN_TYPE && rhs.type == BOOLEAN_TYPE) {
        return varFromBool(lhs.value.b - rhs.value.b);
    }
}

var std_eq2(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromBool(lhs.value.i == rhs.value.i);
    }
    if (lhs.type == STRING_TYPE || rhs.type == STRING_TYPE) {
        return  varFromBool(false);
    }
    if (lhs.type == BOOLEAN_TYPE && rhs.type == BOOLEAN_TYPE) {
        return varFromBool(lhs.value.b == rhs.value.b);
    }

    return varFromBool(false);
}

var std_notEq2(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromBool(lhs.value.i != rhs.value.i);
    }
    if (lhs.type == STRING_TYPE || rhs.type == STRING_TYPE) {
        return  varFromBool(true);
    }
    if (lhs.type == BOOLEAN_TYPE && rhs.type == BOOLEAN_TYPE) {
        return varFromBool(lhs.value.b != rhs.value.b);
    }

    return varFromBool(true);
}

var std_dev(var lhs, var rhs) {
    return varFromInt(lhs.value.i / rhs.value.i);
}

var std_mul(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromInt(lhs.value.i * rhs.value.i);
    }

    return  NaN();
}

var std_less(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromBool(lhs.value.i < rhs.value.i);
    }

    return varFromBool(false);
}

var std_greater(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromBool(lhs.value.i > rhs.value.i);
    }

    return varFromBool(false);
}

var std_and(var lhs, var rhs) {
    return varFromBool(true);
}


static inline var op_plus(var lhs, var rhs) {
    return std_plus(lhs, rhs);
}
static inline var op_minus(var lhs, var rhs) {
    return std_minus(lhs, rhs);
}
static inline var op_and(var lhs, var rhs) {
    return std_and(lhs, rhs);
}
static inline var op_dev(var lhs, var rhs) {
    return std_dev(lhs, rhs);
}
static inline var op_mul(var lhs, var rhs) {
    return std_mul(lhs, rhs);
}
static inline var op_less(var lhs, var rhs) {
    return std_less(lhs, rhs);
}
static inline var op_greater(var lhs, var rhs) {
    return std_greater(lhs, rhs);
}
static inline var op_pow(var lhs, var rhs) {
    var i = varFromInt(0);
    while (isTrue(op_less(i, op_minus(rhs, varFromInt(1))))) {
        lhs = op_mul(lhs, lhs);
        i = op_plus(i, varFromInt(1));
    }
    return lhs;
}
static inline var op_eq2(var lhs, var rhs) {
    return std_eq2(lhs, rhs);
}
static inline var op_notEq2(var lhs, var rhs) {
    return std_notEq2(lhs, rhs);
}



int main() {
    var a = var_array_create_inline(5, varFromInt(1), varFromInt(2), varFromBool(true), varFromString("qwe"), varFromInt(1.5));
    std_print(1, a);
    std_print(1, op_pow(varFromInt(2), varFromInt(2)));
    std_print(1, op_greater(varFromInt(1), varFromInt(2)));
    std_print(1, op_greater(varFromInt(2), varFromInt(1)));
    std_print(1, op_eq2(varFromInt(1), varFromInt(1)));
    std_print(1, op_notEq2(varFromInt(1), varFromInt(1)));
}


//int main() {
//    printf("Hello, World!\n");
//
//
//
//    printf("\n");
//    printf("\n");
//
//    var a = var_array_create_inline(4, varFromInt(1), varFromInt(2), varFromBool(true), varFromString("qwe"));
//    std_print(1, a);
//
//    return 0;
//}