function step_over_test()
{
    console.log("try stepping over this function");
}

function step_into_test(byvalueorbyref)
{
    console.log("this is a function to step into");
    step_over_test();
    byvalueorbyref = 7;
    console.log("inspect a variable test above")
}

function test_debug()
{
    var x = 5;
    console.log("testing debugger");
    console.log("Is it possible to breakpoint here?");
    console.log("use the stepping functions")
    step_into_test(x);
    console.log(x);
}


test_debug();