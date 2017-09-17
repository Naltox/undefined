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

var plus(var lhs, var rhs) {
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

var minus(var lhs, var rhs) {
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

var eq2(var lhs, var rhs) {
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

var notEq2(var lhs, var rhs) {
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

var dev(var lhs, var rhs) {
    return varFromInt(lhs.value.i / rhs.value.i);
}

var mul(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromInt(lhs.value.i * rhs.value.i);
    }

    return  NaN();
}

var less(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromBool(lhs.value.i < rhs.value.i);
    }

    return varFromBool(false);
}

var greater(var lhs, var rhs) {
    if (lhs.type == INTEGER_TYPE && rhs.type == INTEGER_TYPE) {
        return varFromBool(lhs.value.i > rhs.value.i);
    }

    return varFromBool(false);
}


var fib(var n) {


    if (isTrue(eq2(n, varFromInt(0)))) {



        return varFromInt(0);

    }
    if (isTrue(eq2(n, varFromInt(1)))) {



        return varFromInt(1);

    }
    else {



        return (plus(fib(minus(n, varFromInt(1))), fib(minus(n, varFromInt(2)))));

    }
    return NaN();

}


var test(var n) {
    if (isTrue(greater(n, varFromInt(10)))) {
        var_print(1, varFromString("lol"));
    }
    else {
        var_print(1, varFromString("kek"));
    }
    return NaN();
}




int main() {
    printf("Hello, World!\n");



    printf("\n");
    printf("\n");



    test(varFromInt(1));
    test(varFromInt(10));
    test(varFromInt(11));

    return 0;
}