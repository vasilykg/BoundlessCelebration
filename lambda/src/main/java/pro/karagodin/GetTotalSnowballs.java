package pro.karagodin;

import com.google.gson.Gson;

import java.util.function.Function;

public class GetTotalSnowballs implements Function<Request, Response> {

	private final EntityManager entityManager = new EntityManager(System.getenv("DATABASE"), System.getenv("ENDPOINT"));

	@Override
	public Response apply(Request request) {
		return new Response(200, String.valueOf(entityManager.getSnowballs()));
	}
}
