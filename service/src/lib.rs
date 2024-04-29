/*
 * Copyright (c) Johannes Grimm 2024.
 */

pub use sea_orm;

pub use mutation::*;
pub use query::*;

mod mutation;
mod query;

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
